import React, { useState, useEffect } from 'react'
import { TextField, IconButton, Backdrop, CircularProgress, Stack, Breadcrumbs } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import moment from 'moment'
import 'moment-timezone'

import { useDispatch } from 'react-redux'
import { showSnackbar } from '../../redux/actions/snackbarActions'
import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton
} from '@mui/x-data-grid-pro'

import { createTheme } from '@mui/material/styles'
import { createStyles, makeStyles } from '@mui/styles'
import { getAllEvent } from '../../adapter/Api'
import BreadcrumbComponent from '../BreadcrumbComponent'

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const defaultTheme = createTheme()
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        padding: theme.spacing(0.5, 0.5, 0),
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      },
      textField: {
        [theme.breakpoints.down('xs')]: {
          width: '100%'
        },
        margin: theme.spacing(1, 0.5, 1.5),
        '& .MuiSvgIcon-root': {
          marginRight: theme.spacing(0.5)
        },
        '& .MuiInput-underline:before': {
          borderBottom: `1px solid ${theme.palette.divider}`
        }
      }
    }),
  { defaultTheme }
)

function CustomToolbar(props) {
  const classes = useStyles()
  return (
    <GridToolbarContainer>
      <div className={classes.root}>
        <TextField
          type="text"
          size="small"
          id="outlined-error-helper-text"
          // variant="standard"
          value={props.value}
          onChange={props.onChange}
          placeholder="ค้นหา"
          className={'search-input-table'}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" />,
            endAdornment: (
              <IconButton
                title="Clear"
                aria-label="Clear"
                size="small"
                style={{ visibility: props.value ? 'visible' : 'hidden' }}
                onClick={props.clearSearch}>
                <ClearIcon fontSize="small" />
              </IconButton>
            )
          }}
        />
      </div>
      <GridToolbarFilterButton className={'export-button'} />
      <GridToolbarExport
        className={'export-button'}
        csvOptions={{
          fileName: 'รายงานยอดขายรายสินค้า',
          utf8WithBom: true
        }}
      />
      <GridToolbarDensitySelector />
      <GridToolbarColumnsButton className={'export-button'} />
    </GridToolbarContainer>
  )
}

const columns = [
  {
    headerName: 'รหัสสินค้า',
    field: '_event_createdby_employee_id'
  },
  {
    headerName: 'ชื่อสินค้า',
    field: '_event_createdby_employee_name'
  },
  {
    headerName: 'จำนวนที่ขาย',
    field: '_event_createdby_employee_email'
  },
  {
    headerName: 'ยอดขาย',
    field: '_event_createdby_employee_phone'
  },
  {
    headerName: 'ราคาขายเฉลี่ย',
    field: '_event_createdby_employee_department'
  },
  {
    headerName: 'ยอดขายรวมภาษี',
    field: '_event_createdby_employee_position'
  }
]

const getDateByMoment = (date) => {
  if (date) return moment(date).tz('Asia/Bangkok').format('DD/MM/YYYY, hh:mm')
  return '-'
}

const getStatus = (status) => {
  if (status === 'active') return 'ใช้งาน'
  if (status === 'planned') return 'วางแผน'
  if (status === 'scheduled') return 'นัดหมาย'
  if (status === 'finished') return 'สำเร็จ'
  return 'ไม่ใช้งาน'
}

const getContactName = (category, contact) => {
  if (category === 'individual') {
    return `${contact.contact_individual_first_name} ${contact.contact_individual_last_name}`
  } else if (category === 'commercial') {
    return `${contact.contact_commercial_name}`
  } else {
    return `${contact.contact_merchant_name}`
  }
}

export default function ReportIncomeProduct() {
  const [isLoading, setIsLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [cloneData, setCloneData] = useState()
  const [pageSize, setPageSize] = useState(10)
  const dispatch = useDispatch()

  useEffect(() => {
    getAllEvent()
      .then((data) => {
        if (data.data.data !== null) {
          const myData = data.data.data
          console.log('myData', myData)
          const newData = myData.map((event, index) => {
            return {
              ...event,
              id: index + 1,
              event_status: getStatus(event.event_status),
              event_plan_start_date: getDateByMoment(event.event_plan_start_date),
              event_plan_end_date: getDateByMoment(event.event_plan_start_date),
              event_schedule_start_date: getDateByMoment(event.event_schedule_start_date),
              event_schedule_end_date: getDateByMoment(event.event_schedule_end_date),
              event_checkin_start_date: getDateByMoment(event.event_checkin_start_date),
              event_checkin_start_location_name: event.event_checkin_start_location_name,
              event_checkin_dest_date: getDateByMoment(event.event_checkin_dest_date),
              event_checkin_dest_location_name: event.event_checkin_dest_location_name,
              _event_created: getDateByMoment(event._event_created),
              _event_createdby_employee_name: `${event._event_createdby_employee.employee_firstname} ${event._event_createdby_employee.employee_lastname}`,
              _event_createdby_employee_email: event._event_createdby_employee.employee_email,
              _event_createdby_employee_id: event._event_createdby_employee.employee_id,
              _event_createdby_employee_phone: event._event_createdby_employee.employee_phone,
              _event_createdby_employee_department: event._event_createdby_employee.employee_department,
              _event_createdby_employee_position: event._event_createdby_employee.employee_position,
              project_id: event.project && event.project.project_id,
              project_name: event.project && event.project.project_name,
              project_category: event.project && event.project.project_category,
              project_stage: event.project && event.project.project_stage,
              project_type: event.project && event.project.project_type,
              person_name: event.person && `${event.person.person_first_name} ${event.person.person_last_name}`,
              person_id: event.person && event.person.person_id,
              contact_name: event.contact && getContactName(event.contact.contact_business_category, event.contact)
            }
          })
          setRows(newData)
          setCloneData(newData)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        dispatch(showSnackbar('error', `${err}` || 'อ่านข้อมูลผิดพลาด'))
        setIsLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [searchText, setSearchText] = useState('')

  const [filterModel, setFilterModel] = useState({
    items: []
  })

  const requestSearch = (searchValue) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = cloneData.filter((row) => {
      return Object.keys(row).some((field) => {
        if (typeof row[field] === 'string' || typeof row[field] === 'number')
          return searchRegex.test(row[field].toString())
        else return false
      })
    })
    setRows(filteredRows)
  }

  return (
    <div>
      {isLoading && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Stack spacing={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <BreadcrumbComponent name="รายรับ" key="1" to="/income" />
          <BreadcrumbComponent name="รายงาน" key="2" to="/income/report" />
          <BreadcrumbComponent name="รายงานยอดขายรายสินค้า" key="3" to="#" />
        </Breadcrumbs>
      </Stack>
      <h1 style={{ margin: '15px 0 ' }}>รายงานยอดขายรายสินค้า</h1>
      <div className="myTable3">
        <DataGridPro
          rows={rows}
          columns={columns}
          filterModel={filterModel}
          onFilterModelChange={(model) => setFilterModel(model)}
          components={{
            Toolbar: CustomToolbar
          }}
          componentsProps={{
            toolbar: {
              value: searchText,
              onChange: (event) => requestSearch(event.target.value),
              clearSearch: () => requestSearch('')
            }
          }}
          pagination
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
        />
      </div>
    </div>
  )
}
