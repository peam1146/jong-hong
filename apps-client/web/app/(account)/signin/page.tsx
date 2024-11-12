import { Button } from '@/components/ui/button'
import Link from 'next/link'
export default function SignInPage() {
  return (
    <>
      <div className="flex flex-col justify-between items-center h-lvh pt-20 pb-5 pr-5 pl-5">
        <div className="flex flex-col items-center">
          <p className="text-h1 pt-4">Jong Hong</p>
          <p className="text-h2">Book a room</p>
        </div>
        <Link href={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/auth`}>
          <Button className="self-stretch">Sign in with Google</Button>
        </Link>
      </div>
    </>
  )
}
