"use client";
import Preview from "@/components/Canvas/Preview";
import { useAppDispatch } from "@/lib/store/hooks";
import { selectLayer } from "@/lib/store/textEditorSlice";
import { useEffect } from "react";
import { Sidebar } from "./sidebar";

export default function Page() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(selectLayer(null));
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <Preview />
    </div>
  );
}
