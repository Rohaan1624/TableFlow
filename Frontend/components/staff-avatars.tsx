"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChefHat, Utensils, Wine, Users } from "lucide-react"

interface StaffMember {
  id: string
  name: string
  role: "manager" | "server" | "chef" | "host"
  initials: string
}

const staffMembers: StaffMember[] = [
  { id: "1", name: "Sarah M.", role: "manager", initials: "SM" },
  { id: "2", name: "James K.", role: "server", initials: "JK" },
  { id: "3", name: "Maria L.", role: "chef", initials: "ML" },
  { id: "4", name: "David R.", role: "host", initials: "DR" },
]

const roleIcons = {
  manager: Users,
  server: Utensils,
  chef: ChefHat,
  host: Wine,
}

const roleColors = {
  manager: "bg-primary/20 text-primary",
  server: "bg-blue-500/20 text-blue-400",
  chef: "bg-orange-500/20 text-orange-400",
  host: "bg-purple-500/20 text-purple-400",
}

interface StaffAvatarsProps {
  onSelect: (id: string) => void
  selectedId?: string
}

export function StaffAvatars({ onSelect, selectedId }: StaffAvatarsProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Select your profile to clock in
      </p>
      <div className="grid grid-cols-2 gap-3">
        {staffMembers.map((member) => {
          const Icon = roleIcons[member.role]
          const isSelected = selectedId === member.id
          return (
            <button
              key={member.id}
              onClick={() => onSelect(member.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
              }`}
            >
              <Avatar className={`h-10 w-10 ${roleColors[member.role]}`}>
                <AvatarFallback className="bg-transparent text-sm font-medium">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  {member.name}
                </p>
                <div className="flex items-center gap-1">
                  <Icon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground capitalize">
                    {member.role}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
