"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { createDocuments } from "@/lib/actions/room.actions";
import { useRouter } from "next/navigation";

const AddDocumentBtn = ({ email, userId }: AddDocumentBtnProps) => {
  const router = useRouter();

  const addDocumentHandler = async () => {
    try {
      const room = await createDocuments({ userId, email });

      if (room) router.push(`/documents/${room.id}`);
    } catch (err) {
      console.log(`Error occured while clicking on add new document: ${err}`);
    }
  };

  return (
    <Button
      type="submit"
      onClick={addDocumentHandler}
      className="gradient-blue flex gap-1 shadow-md"
    >
      <Image src="/assets/icons/add.svg" alt="add" width={32} height={32} />
      <p className="hidden sm:block">Start a blank document</p>
    </Button>
  );
};

export default AddDocumentBtn;
