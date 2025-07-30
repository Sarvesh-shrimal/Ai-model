import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,

} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { alluser, studentinfo } from "@/modules/service/student/StudentInfo";
import { Input } from "@/components/ui/input";

export type StudentData = {
  _id: string,
  name: string,
  student_id: string,
}

export const First = () => {

  const [data, setData] = useState<StudentData[] | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [description, setDescription] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const ID = localStorage.getItem("Id");
  useEffect(() => {
    const FetchData = async () => {
      const res = await alluser();
      setData(res.data);
    }
    FetchData();
  }, [])

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      student_id: selectedId,
      description: description,
    };

    try {
      await studentinfo(payload);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Card className="w-full h-fit">
      <CardHeader>
        <CardTitle>Student Information Form </CardTitle>

        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>

      </CardHeader>
      <CardContent>
        <form onSubmit={handlesubmit}>
          <div className="flex flex-col gap-6 ">
            <div className="flex flex-row space-x-3">
              <div className="grid gap-2">
                <Label htmlFor="email">Student Id</Label>
                <Select
                  onValueChange={(value) => {
                    setSelectedId(value);
                    const selectedStudent = data?.find(student => student._id === value)
                    setSelectedName(selectedStudent?.name || "")
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Student Id" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Student Id</SelectLabel>
                      {
                        data
                          ?.filter((student) => ID !== student._id) // <-- correct filter syntax
                          .map((student) => (
                            <SelectItem key={student._id} value={student._id}>
                              {student.student_id}
                            </SelectItem>
                          ))
                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label> Student name </Label>
                <Input placeholder="student name " readOnly value={selectedName} />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Description</Label>


              </div>
              <Textarea placeholder="write Description here..... "

                value={description}
                onChange={(e) => setDescription(e.target.value)}

              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-3 w-sm items-center">
            <Button type="submit" className="w-full">
              Submit
            </Button>
            <Button variant="outline" className="w-full">
              Discard
            </Button>
          </div>

        </form>
      </CardContent>

    </Card>
  );
}




