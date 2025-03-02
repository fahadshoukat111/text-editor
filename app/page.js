import Image from "next/image";
import TextDisplay from "./text-editor";
import PdfViewer from "./PDF";

export default function Home() {
  return (
    <main>
      {/* <TextDisplay /> */}
      <PdfViewer/>
    </main>
  );
}
