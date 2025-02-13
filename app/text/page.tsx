"use client";
import Preview from "@/components/Canvas/Preview";
import { textRoute } from "@/components/Navigation/routes";
import { useAppDispatch } from "@/lib/store/hooks";
import { selectLayer } from "@/lib/store/textEditorSlice";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "./sidebar";

export default function Page() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    return () => {
      // Normally, this `selectLayer` call deselects the selected text layer
      // if the user moves to a different route while a layer is selected.
      // This check on pathname fixes the issue where user selects a text layer
      // from `frameRoute` and redirected to `textRoute` and loses the selection.
      if (pathname !== textRoute.path) {
        dispatch(selectLayer(null));
      }
    };
  }, [dispatch, pathname]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <Preview />
    </div>
  );
}
