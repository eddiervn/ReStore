import { Checkbox, FormControlLabel, FormGroup, FormLabel } from "@mui/material";
import { useState } from "react";

interface Props{
    items: string[],
    checkedItems: string[],
    onChange: (items: string[]) => void,
    label: string
}

export default function CheckboxButtonGroup({items, checkedItems, onChange, label}:Props){

  const [currentCheckedItems,setCurrentCheckedItems] = useState(checkedItems);

  function handleCheckedChange(value: string)
  {
     const currentIndex = currentCheckedItems.findIndex(x => x === value);
     const  newCurrentCheckedItems = currentIndex === -1? [...currentCheckedItems, value] : currentCheckedItems.filter(x => x!== value)
     setCurrentCheckedItems(newCurrentCheckedItems);
     onChange(newCurrentCheckedItems);
  }

  return (
    <>
      <FormLabel>{label}</FormLabel>
        <FormGroup sx={{px:1}}>
            {items.map(item => (<FormControlLabel 
            sx={{mt:1}}
            label={item}
            value={item}
            control={<Checkbox  
                checked = {currentCheckedItems.includes(item)} sx={{mt:0,p:0}}
                onClick={(e:any) => handleCheckedChange(e.target.value)} />} 
            key={item} />))}
       </FormGroup>
    </>
  )
}