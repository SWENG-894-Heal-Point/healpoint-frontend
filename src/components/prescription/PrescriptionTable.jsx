import {useEffect} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {Paper, IconButton} from "@mui/material";
import {AddCircle, Delete} from '@mui/icons-material';

import {defaultDataGridStyle} from "@/utils/defaultDataGridStyle.js";
import style from "@/styles/prescription.module.css";


export default function PrescriptionTable({items, setItems, editable}) {
    const dataGridStyle = defaultDataGridStyle();

    function handleAddItem() {
        const maxId = items.length > 0
            ? Math.max(...items.map(item => item.itemNumber || 0))
            : 0;

        const newItem = {
            itemNumber: maxId + 1,
            medication: null,
            dosage: null,
            frequency: null,
            duration: null,
            fillsLeft: null,
        };
        setItems([...items, newItem]);
    }

    function handleDeleteItem(itemNumber) {
        setItems(items.filter((item) => item.itemNumber !== itemNumber));
    }

    useEffect(() => {
        if (editable && items.length === 0) {
            handleAddItem();
        }
        // eslint-disable-next-line
    }, [editable]);

    function handleProcessRowUpdate(updatedRow) {
        const updatedItems = items.map((item) =>
            item.itemNumber === updatedRow.itemNumber ? updatedRow : item
        );
        setItems(updatedItems);
        return updatedRow;
    }

    const columns = [
        {field: 'medication', headerName: 'Medication', flex: 1, editable: editable},
        {
            field: 'dosage',
            headerName: 'Dosage',
            flex: 1,
            editable: editable,
            renderCell: (params) => (<span> {params.value ? `${params.value} mg` : ""} </span>)
        },
        {
            field: 'frequency',
            headerName: 'Frequency',
            flex: 1,
            editable: editable,
            renderCell: (params) => (<span> {params.value ? `${params.value}x/day` : ""} </span>)
        },
        {
            field: 'duration',
            headerName: 'Duration',
            flex: 1,
            editable: editable,
            renderCell: (params) => (<span> {params.value ? `${params.value} days` : ""} </span>)
        },
        {field: 'fillsLeft', headerName: 'Fills Left', flex: 1, editable: editable},
        ...(editable
            ? [
                {
                    field: "actions",
                    headerName: "Actions",
                    flex: 0.5,
                    sortable: false,
                    filterable: false,
                    renderCell: (params) => (
                        <IconButton color="error" onClick={() => handleDeleteItem(params.row.itemNumber)}>
                            <Delete/>
                        </IconButton>
                    ),
                },
            ]
            : []),
    ];

    return (
        <>
            {items && items.length > 0 ?
                <>
                    <Paper sx={{width: '100%'}}>
                        <DataGrid
                            rows={items}
                            columns={columns}
                            getRowId={(row) => row.itemNumber}
                            pagination={false}
                            hideFooter={true}
                            processRowUpdate={handleProcessRowUpdate}
                            sx={dataGridStyle}
                        />
                    </Paper>
                    {editable && <AddCircle className={style.add_btn} onClick={handleAddItem}/>}
                </>
                :
                <div className={style.empty_prescription}>
                    This patient does not have an existing prescription.
                </div>
            }
        </>
    );
}