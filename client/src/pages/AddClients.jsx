import { useRecoilState } from "recoil";
import { Button, Dialog, DialogHeader, Typography } from "@material-tailwind/react";
import { Banner } from "../components/Settings/Banner";
import { useState } from "react";
import { AddClient } from "../components/AddClient/AddClient";

const AddClients = () => {
    const [openAddClientModel,setOpenAddClientModel] = useState(false)

    const openAddClientModalHandler = ()=>{
        setOpenAddClientModel(previous=>!previous)
    }

  return(
    <div className="p-8">
      <Button onClick={openAddClientModalHandler} className="capitalize bg-maingreenhvr text-black" variant="filled" >Add Client</Button>
      <Dialog open={openAddClientModel} handler={setOpenAddClientModel} size="xl" className="outline-none">
        
        <Typography variant="h3" className="text-center p-4">
            Add your client...
        </Typography>
        
        <AddClient/>
      </Dialog>
    </div>
  )
}

export default AddClients