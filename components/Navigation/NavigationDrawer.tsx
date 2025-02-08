"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface NavigationDrawerProps {
  isOpen: boolean;
  selectedSection: string | null;
  onClose: () => void;
}

const drawerContent = {
  Analytics: {
    title: "Analytics Dashboard",
    sections: [
      { title: "Overview", content: "Analytics overview content" },
      { title: "Reports", content: "Analytics reports content" },
      { title: "Metrics", content: "Key metrics content" },
    ],
  },
  Team: {
    title: "Team Management",
    sections: [
      { title: "Members", content: "Team members list" },
      { title: "Roles", content: "Role management" },
      { title: "Permissions", content: "Permission settings" },
    ],
  },
  Projects: {
    title: "Project Hub",
    sections: [
      { title: "Active Projects", content: "Current projects" },
      { title: "Archives", content: "Past projects" },
      { title: "Templates", content: "Project templates" },
    ],
  },
  Calendar: {
    title: "Calendar",
    sections: [
      { title: "Schedule", content: "Calendar view" },
      { title: "Events", content: "Event management" },
      { title: "Reminders", content: "Reminder settings" },
    ],
  },
};

export function NavigationDrawer({
  isOpen,
  selectedSection,
  onClose,
}: NavigationDrawerProps) {
  const content = selectedSection
    ? drawerContent[selectedSection as keyof typeof drawerContent]
    : null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] p-0 ml-16">
        {content && (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">{content.title}</h2>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6">
                {content.sections.map((section) => (
                  <div key={section.title} className="mb-6">
                    <h3 className="text-sm font-medium mb-2">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
