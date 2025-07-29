import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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

export const First = () => {

  const Ids = [
    'A', 'B', 'C', 'D'
  ];


  return (


    <Card className="w-full h-fit">
      <CardHeader>
        <CardTitle>Student Information Form </CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>

      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Student Id</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Student Id" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Student Id</SelectLabel>
                    {
                      Ids.map((id, index) => {
                        return (
                          <SelectItem key={index} value={id}>{id}</SelectItem>
                        )
                      })
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Description</Label>
                
                  
              </div>
              <Textarea placeholder="write Description here..... "/>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div className="flex flex-row gap-2">
          <Button type="submit" className="w-full">
            Submit
          </Button>
          <Button variant="outline" className="w-full">
            Discard
          </Button>
        </div>

      </CardFooter>
    </Card>
  );
}




