"use client";
import Preview from "@/components/Canvas/Preview";
import { myFramesRoute } from "@/components/Navigation/routes";
import { useFrameEditor } from "@/hooks/use-frame-settings";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FrameEditSidebar from "./frame-edit-sidebar";
import { ImageEditSidebar } from "./image-edit-sidebar";
import { TextEditSidebar } from "./text-edit-sidebar";

export default function Home() {
  const { frameEditor } = useFrameEditor();
  const { layers, layerEditor } = useFrameEditor();

  const router = useRouter();

  useEffect(() => {
    if (!frameEditor) {
      router.push(myFramesRoute.path);
    }
  }, [frameEditor, router]);

  if (!frameEditor) {
    return null;
  }

  const shouldShowTextEditSidebar = (): boolean => {
    if (!layerEditor) return false;
    const layer = layers?.find((layer) => layer.id === layerEditor.id);
    return layer!.type === "text";
  };

  const shouldShowImageEditSidebar = (): boolean => {
    if (!layerEditor) return false;
    const layer = layers?.find((layer) => layer.id === layerEditor.id);
    return layer!.type === "image";
  };

  return (
    <div className="flex h-screen">
      {shouldShowTextEditSidebar() ? (
        <TextEditSidebar />
      ) : shouldShowImageEditSidebar() ? (
        <ImageEditSidebar />
      ) : (
        <FrameEditSidebar />
      )}
      <Preview />
    </div>
  );
}
