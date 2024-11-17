import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

interface Props{
    options: any[],
    selectedValue: string,
    label: string,
    onChange: (event: any) => void,
}

export default function RadioButtonGroup({options, selectedValue, label, onChange}: Props){
  return (
   <FormControl>
    <FormLabel>{label}</FormLabel>
    <RadioGroup onChange={onChange} value={selectedValue}>
        {options.map(({value, label}) => (<FormControlLabel sx={{mt:1}}
        value={value} label={label} control={<Radio sx={{mt:0,mb:0,py:0}}/>} key={value}/>))}
    </RadioGroup>
   </FormControl>
  )
}