"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { CommunityData } from "./create-community-modal"

interface CommunitySettingsProps {
  data: CommunityData
  updateData: (data: Partial<CommunityData>) => void
}

export function CommunitySettings({ data, updateData }: CommunitySettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Community Settings</h3>
        <p className="text-sm text-muted-foreground mb-4">Configure additional settings for your community.</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="private-community" className="text-base">
              Private Community
            </Label>
            <p className="text-sm text-muted-foreground">Only approved members can join and view content</p>
          </div>
          <Switch
            id="private-community"
            className="cursor-pointer"
            checked={data.isPrivate}
            onCheckedChange={(checked) => updateData({ isPrivate: checked })}
          />
        </div>

        <div className="p-4 bg-muted/50 rounded-md">
          <h4 className="font-medium mb-2">Community Preview</h4>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-md overflow-hidden bg-background flex items-center justify-center">
              {data.image ? (
                <img src={data.image || "/placeholder.svg"} alt={data.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                  {data.name ? data.name.charAt(0).toUpperCase() : "C"}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold">{data.name || "Community Name"}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {data.description || "Community description will appear here"}
              </p>
              {(data.country || data.city) && (
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="inline-flex items-center">
                    📍 {[data.city, data.country].filter(Boolean).join(", ")}
                  </span>
                </p>
              )}
              <div className="flex gap-1 mt-1">
                {data.tags.length > 0 ? (
                  data.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No tags added</span>
                )}
                {data.tags.length > 3 && (
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">+{data.tags.length - 3}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

