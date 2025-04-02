import { Button } from "@/components/ui/button";
import { div, divContent, divHeader, divTitle } from "@/components/ui/div";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateClassPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create New Class"
        text="Set up a new class for student teacher supervision"
      />

      <div>
        <divHeader>
          <divTitle>Class Details</divTitle>
        </divHeader>
        <divContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Class Name</Label>
              <Input id="name" placeholder="e.g., Elementary Education 101" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the class and its focus"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="term">Term</Label>
                <Input id="term" placeholder="e.g., Spring 2025" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade-level">Grade Level</Label>
                <Input
                  id="grade-level"
                  placeholder="e.g., Elementary, Middle School, High School"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit">Create Class</Button>
            </div>
          </form>
        </divContent>
      </div>
    </DashboardShell>
  );
}
