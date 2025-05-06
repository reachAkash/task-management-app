import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
} from "lucide-react";

export const statusOptions = ["Not started", "In progress", "Completed"];
export const priorityOptions = ["High", "Medium", "Low"];

export const teams = [
  {
    name: "Taskify Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
  {
    name: "Taskify Corp.",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Taskify Corp.",
    logo: Command,
    plan: "Free",
  },
];

export const sectors = [
  {
    name: "Design Engineering",
    url: "#",
    icon: Frame,
  },
  {
    name: "Sales & Marketing",
    url: "#",
    icon: PieChart,
  },
  {
    name: "Travel",
    url: "#",
    icon: Map,
  },
];
