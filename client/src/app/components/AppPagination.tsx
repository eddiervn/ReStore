import { Box, Pagination, Typography } from "@mui/material";
import { MetaData } from "../models/pagination";

interface Props{
    metaData: MetaData;
    onPageChange: (page:number) => void;
}

export default function AppPagination({metaData, onPageChange}: Props){
  const {currentPage, totalCount, totalPages, pageSize} = metaData;
  const start = pageSize * (currentPage - 1) + 1;
  let end = currentPage * pageSize;
  if(end > totalCount) end = totalCount;
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>
                Displaying items {start} - {end} out of {totalCount}
        </Typography>
        <Pagination 
        color='secondary' 
        size="medium" 
        count={totalPages} 
        page={currentPage}
        onChange={( _, pageNumber ) => onPageChange(pageNumber)}/>
    </Box>
  )
}