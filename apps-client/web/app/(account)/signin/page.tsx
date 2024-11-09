import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { User, Key } from '@phosphor-icons/react/dist/ssr'

export default function SignInPage() {
  return (
    <>
      <div className="flex flex-col justify-between items-center h-lvh pt-20 pb-5 pr-5 pl-5">
        <div className="flex flex-col items-center">
          <p className="text-h1 pt-4">Jong Hong</p>
          <p className="text-h2">Book a room</p>
        </div>
        <div className="flex flex-col items-start gap-4 self-stretch">
          <Input placeholder="Student ID" icon={<User color="black" weight="bold" />} />
          <Input
            type="password"
            placeholder="Password"
            icon={<Key color="black" weight="bold" />}
          />
        </div>
        <Button className="self-stretch">Sign in</Button>
      </div>
    </>
  )
}
