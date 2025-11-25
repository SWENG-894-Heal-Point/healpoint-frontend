import {Paper} from "@mui/material";
import {DataGrid} from '@mui/x-data-grid';
import {Check, Clear} from "@mui/icons-material";

import {transformText} from "@/utils/transformText.js";
import {defaultDataGridStyle} from "@/utils/defaultDataGridStyle.js";
import style from '@/styles/user-list.module.css';

export default function AllRolesUserTable({users, apiRef}) {
    const dataGridStyle = defaultDataGridStyle();
    const iconStyle = {verticalAlign: 'middle'};
    const paginationModel = {page: 0, pageSize: 5};

    const columns = [
        {field: 'id', headerName: 'ID', flex: 1, maxWidth: 50},
        {field: 'email', headerName: 'Email', flex: 1.5},
        {field: 'role', headerName: 'Role', flex: 1},
        {field: 'isActive', headerName: 'Active', flex: 1,
        renderCell: (params) => (<span> {params.value === true ? <Check sx={iconStyle}/> : <Clear sx={iconStyle}/>} </span>)},
        {field: 'firstName', headerName: 'First Name', flex: 1},
        {field: 'lastName', headerName: 'Last Name', flex: 1},
        {field: 'dateOfBirth', headerName: 'Date of Birth', flex: 1},
        {field: 'gender', headerName: 'Gender', flex: 1},
    ];

    const rows = users.map(user => ({
        ...user,
        gender: transformText(user.gender, "sentence"),
        role: transformText(user.role.replace("_", " "), "title")
    }));

    return (
        <div>
            <Paper sx={{width: '100%'}}>
                <DataGrid
                    apiRef={apiRef}
                    rows={rows}
                    columns={columns}
                    initialState={{pagination: {paginationModel}}}
                    pageSizeOptions={[5, 10, 20, 50]}
                    getRowId={(row) => row.id}
                    className={style.user_table}
                    sx={dataGridStyle}
                    checkboxSelection
                    disableMultipleRowSelection
                />
            </Paper>
        </div>
    );
}