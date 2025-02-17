"use client";
import Preview from "@/components/Canvas/Preview";
import { myFramesRoute } from "@/components/Navigation/routes";
import { useFrameSettings } from "@/hooks/use-frame-settings";
import { useAppSelector } from "@/lib/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FrameEditSidebar from "./frame-edit-sidebar";
import { ImageEditSidebar } from "./image-edit-sidebar";
import { TextEditSidebar } from "./text-edit-sidebar";

export default function Home() {
  const { frameSettings } = useFrameSettings();
  const { layers, selectedLayerId } = useAppSelector(
    (state) => state.textEditor
  );

  const router = useRouter();

  useEffect(() => {
    if (!frameSettings) {
      router.push(myFramesRoute.path);
    }
  }, [frameSettings, router]);

  if (!frameSettings) {
    return null;
  }

  const shouldShowTextEditSidebar = (): boolean => {
    if (selectedLayerId == null) return false;
    const layer = layers.find((layer) => layer.id === selectedLayerId);
    return layer!.type === "text";
  };

  const shouldShowImageEditSidebar = (): boolean => {
    if (selectedLayerId == null) return false;
    const layer = layers.find((layer) => layer.id === selectedLayerId);
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
