import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'
import Link from 'next/link'

const exampleMessages = [
  {
    heading: 'Marriage',
    message: `How is child custody determined in Switzerland in case of a divorce?`,
    imagename:'marriage.png'
  },
  {
    heading: 'Contract',
    message: 'How can I renew my car lease?',
    imagename:'contract.png'
  },
  {
    heading: 'Migration',
    message: `How many years to wait to apply for C Permit?`,
    imagename:'migration.png'
  },
  {
    heading: 'Housing',
    message: 'Can you explain the rules for buying real estate in Switzerland for a non-resident?',
    imagename:'housing.png'
  },
  {
    heading: 'Maternity',
    message: `How many weeks of maternity leave can I avail?`,
    imagename:'maternity.png'
  },
  {
    heading: 'Crime',
    message: 'What to do if someone stole my bike?',
    imagename:'crime.png'
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to Wingbot AI: Your Personal Legal Assistant!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          Introducing Wingbot AI, an innovative open-source chatbot designed to revolutionize your experience with Swiss private law. Our cutting-edge AI technology simplifies complex legal jargon, offering instant, reliable answers to your legal queries. We're committed to making expert legal guidance accessible to everyone, anytime.
        </p>
        
        <div className="mt-4  grid grid-flow-row-dense grid-cols-3 grid-rows-2 items-start space-y-2">
          {exampleMessages.map((message, index) => (
           
          
          <img src={message.imagename} alt={message.heading} onClick={() => setInput(message.message)}></img>
    
          ))}
          
        </div>
      </div>
    </div>
  )
}
