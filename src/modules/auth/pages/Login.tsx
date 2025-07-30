import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLogin } from "@/modules/service/auth/Auth"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handlesubmit = async (e : React.FormEvent) => {
    e.preventDefault();
    const payload = {email, password};
    try {
      const response = await AuthLogin(payload)
      if(response.token){
        console.log(response);
        localStorage.setItem("token", response.token);
        localStorage.setItem("email", response.userId.email)
        localStorage.setItem("Id", response.userId._id)
        navigate('/first')
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlesubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>

              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="m-3">
            <Button type="submit" className="w-full mt-3">
              Login
            </Button>
            <Button variant="outline" className="w-full mt-3">
              Login with Google
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">

      </CardFooter>
    </Card>
  )
}
