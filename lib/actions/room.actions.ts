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
  console.log("___", roomId);

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
