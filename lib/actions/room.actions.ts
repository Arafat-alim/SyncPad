"use server";

import { liveblocks } from "../liveblocks";
import { nanoid } from "nanoid";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

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
      defaultAccesses: ["room:write"], // TODO: we need to change it back to empty array
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
    // const hasAccess = Object.keys(room.usersAccesses).includes(userId);
    // if (!hasAccess) {
    //   throw new Error("You do not have access to this document");
    // }

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
