import { useNavigate, useParams } from "react-router-dom";
import { DashboardHeader } from "../Components/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/tabs";
import { DashboardShell } from "../Components/dashboard-shell";

// Mock class data
const classData = {
  id: 1,
  name: "Elementary Education 101",
  students: [
    { id: 1, name: "Alex Johnson", email: "alex.j@example.com", type: "GE" },
    { id: 2, name: "Jamie Smith", email: "jamie.s@example.com", type: "SE" },
    { id: 3, name: "Taylor Brown", email: "taylor.b@example.com", type: "GE" },
    { id: 4, name: "Morgan Lee", email: "morgan.l@example.com", type: "GE" },
    { id: 5, name: "Casey Wilson", email: "casey.w@example.com", type: "SE" },
  ],
};

export default function ClassDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <DashboardShell>
      <DashboardHeader heading={classData.name} />

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          {classData.students.map((student) => (
            <div
              key={student.id}
              onClick={() => navigate(`/students/${student.id}`)}
              className="cursor-pointer border p-4 rounded-md shadow-sm hover:bg-gray-50"
            >
              <h2 className="text-lg font-semibold">{student.name}</h2>
              <p className="text-sm text-gray-600">{student.email}</p>
              <p className="text-xs text-gray-500">Type: {student.type}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="analytics">
          <p className="text-gray-500">Analytics coming soon...</p>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
