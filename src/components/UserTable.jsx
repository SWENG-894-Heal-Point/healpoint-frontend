import { DataGrid } from '@mui/x-data-grid';
import {Paper} from "@mui/material";

import {transformText} from "@/utils/transformText.js";
import {defaultDataGridStyle} from "@/utils/defaultDataGridStyle.js";
import style from '@/styles/user-list.module.css';

export default function UserTable({ users, setProfileData, columns }) {
    const dataGridStyle = defaultDataGridStyle();

    const baseColumns = [
        { field: 'viewProfile', headerName: '', flex: 1, renderCell: (params) => (
                <div className={`${style.link}`} >
                <span onClick={() => {setProfileData(params.row)}}>
                    View profile
                </span>
                </div>
            )
        }
    ];

    const allColumns = [
        ...columns,
        ...baseColumns
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
                columns={allColumns}
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