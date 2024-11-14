import { useEffect, useRef } from "react"

export const InputComponent = ({ subTaskName, setSubTaskName, updateName, taskName=false }) => {
  const inputRef = useRef(null)

  useEffect(()=>{
    if(inputRef.current){
      inputRef.current.focus()
    }
  },[])

  return (
    <form onSubmit={updateName} className="w-full">
      <input ref={inputRef} onBlur={updateName} onChange={(event)=>setSubTaskName(event.target.value)} defaultValue={subTaskName} type="text" className={`capitalize ${taskName && "font-bold text-xl text-black"} w-full outline-none bg-transparent`} />
      <button className="hidden" type='submit'></button>
    </form>
  )
}