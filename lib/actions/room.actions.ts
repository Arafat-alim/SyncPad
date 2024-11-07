"use server";

import { liveblocks } from "../liveblocks";
import { nanoid } from "nanoid";
import { getAccessType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { title } from "process";

export const createDocuments = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  // TODO: Need to remove this in future.
  if (!userId || !email) {
    console.error("Something went missing...");
    return;
  }

  try {
    //! before creating the room, we need to create a metadata
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    //! create a access to the user, which he/she can edit the document
    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"], // you can check the type declartion file for the reference
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    });

    revalidatePath("/"); // read more about at:https://nextjs.org/docs/app/api-reference/functions/revalidatePath

    return parseStringify(room);
  } catch (err) {
    console.log(`Error occured while creating a document: ${err}`);
  }
};

export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  if (!userId || !roomId) {
    console.log("something went wrong");
  }
  try {
    //! check if any rooms is present
    const room = await liveblocks.getRoom(roomId);

    //! check user has access
    const hasAccess = Object.keys(room.usersAccesses).includes(userId);
    if (!hasAccess) {
      throw new Error("You do not have access to this document");
    }

    return parseStringify(room);
  } catch (err) {
    console.log(`Error occured while fetching the documents: ${err}`);
  }
};

export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });

    revalidatePath(`/documents/${roomId}`);

    return parseStringify(updatedRoom);
  } catch (err) {
    console.log(
      `Error occured while updating the Liveblock Room document: ${err}`
    );
  }
};

export const getDocuments = async (email: string) => {
  try {
    const rooms = await liveblocks.getRooms({ userId: email });
    return parseStringify(rooms);
  } catch (err) {
    console.log("Error occured while fetching the rooms");
  }
};

export const updateDocumentAccess = async ({
  roomId,
  userType,
  updatedBy,
  email,
}: ShareDocumentParams) => {
  try {
    //! get all the user access type
    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    };

    //! updated the access type
    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses,
    });

    if (room) {
      const notificationId = nanoid();

      await liveblocks.triggerInboxNotification({
        userId: email,
        kind: "$documentAccess",
        subjectId: notificationId,
        activityData: {
          userType,
          title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email,
        },
        roomId,
      });
    }

    revalidatePath(`/documents/${roomId}`);

    return parseStringify(room);
  } catch (err) {
    console.log(`Error occured while updating the user access type: ${err}`);
  }
};

export const removeCollaborator = async ({
  roomId,
  email,
}: {
  roomId: string;
  email: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    if (room.metadata.email === email) {
      throw new Error("You cannot remove yourself from the document");
    }

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null,
      },
    });

    revalidatePath(`/documents/${roomId}`);

    return parseStringify(updatedRoom);
  } catch (err) {
    console.log(`Error occured while removing the collaborator: ${err}`);
  }
};

export const deleteDocument = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);

    revalidatePath("/");
    redirect("/");
  } catch (err) {
    console.log(`Error occured while deleting the document: ${roomId}`);
  }
};
