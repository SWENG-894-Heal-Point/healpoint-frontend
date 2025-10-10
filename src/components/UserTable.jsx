import { DataGrid } from '@mui/x-data-grid';
import {Paper} from "@mui/material";

import {transformText} from "@/utils/transformText.js";
import {defaultDataGridStyle} from "@/utils/defaultDataGridStyle.js";
import style from '@/styles/user-list.module.css';

export default function UserTable({ users, setProfileData }) {
    const dataGridStyle = defaultDataGridStyle();
    const columns = [
        { field: 'firstName', headerName: 'First Name', flex: 1 },
        { field: 'lastName', headerName: 'Last Name', flex: 1 },
        { field: 'dateOfBirth', headerName: 'Date of Birth', flex: 1 },
        { field: 'gender', headerName: 'Gender', flex: 1},
        { field: 'viewProfile', headerName: '', flex: 1, renderCell: (params) => (
            <div className={`${style.link}`} >
                <span onClick={() => {setProfileData(params.row)}}>
                    View profile
                </span>
            </div>
            )
        }
    ];

    const rows = users.map(user => ({
        ...user,
        gender: transformText(user.gender, "sentence")
    }));

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <Paper sx={{ width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 20, 50]}
                getRowId={(row) => row.id}
                disableRowSelectionOnClick
                className={style.user_table}
                sx={dataGridStyle}
            />
        </Paper>

    );
}