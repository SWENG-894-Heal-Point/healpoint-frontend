import {Paper} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {defaultDataGridStyle} from "@/utils/defaultDataGridStyle.js";
import style from "@/styles/user-list.module.css";

export default function NotificationTable({notificationData}) {
    const columns = [
        {field: 'createdAt', headerName: 'Timestamp', flex: 1, minWidth: 120, maxWidth: 200},
        {field: 'message', headerName: 'Message', flex: 3}
    ];

    const rows = notificationData.map(notification => ({
        ...notification,
        createdAt: new Date(notification.createdAt).toLocaleString()
    }));

    const dataGridStyle = defaultDataGridStyle();
    const paginationModel = {page: 0, pageSize: 5};

    if (rows.length === 0) {
        return null;
    }

    return (
        <Paper sx={{width: '100%', maxWidth: '800px'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{pagination: {paginationModel}}}
                pageSizeOptions={[5, 10, 20, 50]}
                getRowId={(row) => row.id}
                disableRowSelectionOnClick
                className={style.user_table}
                sx={dataGridStyle}
            />
        </Paper>
    );
}
