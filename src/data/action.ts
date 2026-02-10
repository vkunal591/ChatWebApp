import { UserPlus, FileText, Radio, RefreshCcw } from "lucide-react";

export const actions = [
  {
    title: "Add User",
    description: "Create new operative account",
    icon: UserPlus,
    action: "ADD_USER",
  },
  {
    title: "Export Report",
    description: "Generate activity summary",
    icon: FileText,
    action: "EXPORT",
  },
  {
    title: "Send Alert",
    description: "Broadcast emergency message",
    icon: Radio,
    action: "ALERT",
  },
  {
    title: "Sync Data",
    description: "Update all field devices",
    icon: RefreshCcw,
    action: "SYNC",
  },
];
