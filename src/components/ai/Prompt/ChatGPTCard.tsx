import { LightBulbIcon, SearchIcon } from '@primer/octicons-react'
import { useEffect, useState } from 'react'
import { TriggerMode } from '@src/config/config'
import ChatGPTQuery, { QueryStatus } from './ChatGPTQuery'
import { endsWithQuestionMark } from '../../../../Utils/utils'
import { useGPT } from '../../Context/ChatGptContext'

interface Props {
  question: string
  triggerMode: TriggerMode
  triggered: boolean
  onStatusChange?: (status: QueryStatus) => void
}

function ChatGPTCard(props: Props) {
  const [triggered, setTriggered] = useState(props.triggered)



  useEffect(() => {
    console.log('triggered', triggered)
  }, [props.triggered]);



  // if (props.triggerMode === TriggerMode.Always) {
  //   return <ChatGPTQuery question={props.question} onStatusChange={props.onStatusChange} />
  // }
  // if (props.triggerMode === TriggerMode.QuestionMark) {
  //   if (endsWithQuestionMark(props.question.trim())) {
  //     return <ChatGPTQuery question={props.question} onStatusChange={props.onStatusChange} />
  //   }
  //   return (
  //     <p className="icon-and-text">
  //       <LightBulbIcon size="small" /> Trigger ChatGPT by appending a question mark after your query
  //     </p>
  //   )
  // }
  if (triggered) {
    return <ChatGPTQuery question={props.question} onStatusChange={props.onStatusChange} />
  }
  return (
    <p className="icon-and-text cursor-pointer" onClick={() => setTriggered(true)}>
      <SearchIcon size="small" /> Ask ChatGPT for this query
    </p>
  )
}

export default ChatGPTCard
