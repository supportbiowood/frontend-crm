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
import { getQuotation } from '../../adapter/Api'
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
          fileName: 'รายงานใบเสนอราคา',
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
    headerName: 'เลขที่ใบเสนอราคา',
    field: 'quotation_document_id'
  },
  {
    headerName: 'วันที่ออกเอกสาร',
    field: 'quotation_issue_date'
  },
  {
    headerName: 'ชื่อลูกค้า',
    field: 'contact_name'
  },
  {
    headerName: 'เลขที่โครงการ',
    field: 'project_id'
  },
  {
    headerName: 'ชื่อโครงการ',
    field: 'project_name'
  },
  {
    headerName: 'เลขที่เอกสารอ้างอิง',
    field: 'ref_document_id'
  },
  {
    headerName: 'ใช้ได้ถึง',
    field: 'quotation_valid_until_date'
  },
  {
    headerName: 'สถานะ',
    field: 'quotation_status'
  },
  {
    headerName: 'เกินเวลา',
    field: 'quotation_over_due_date'
  },
  {
    headerName: 'ยอดสุทธิ',
    field: 'net_amount'
  }
]

const getDateByMoment = (date) => {
  if (date) return moment.unix(date).format('DD/MM/YYYY')
  return '-'
}

const checkOverDueDate = (issue_date, due_date, status) => {
  issue_date = moment.unix(issue_date)
  due_date = moment.unix(due_date)

  if (
    status !== 'เสร็จสิ้น' &&
    status !== 'ยกเลิก' &&
    Math.ceil(moment.duration(due_date.diff(issue_date)).asDays()) > 0
  ) {
    return 'เกินเวลา'
  } else {
    return '-'
  }
}

const getStatus = (status) => {
  if (status === 'draft') return 'ร่าง'
  if (status === 'wait_accept') return 'รอตอบรับ'
  if (status === 'wait_approve') return 'รออนุมัติ'
  if (status === 'closed') return 'เสร็จสิ้น'
  if (status === 'not_approve') return 'ยกเลิก'
  if (status === 'accepted') return 'ตอบรับแล้ว'
  if (status === 'payment_complete') return 'ชำระแล้ว'
  return 'ยกเลิก'
}

function toLocale(number) {
  return parseFloat(number).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export default function ReportIncomeQuotation() {
  const [isLoading, setIsLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [cloneData, setCloneData] = useState()
  const [pageSize, setPageSize] = useState(10)
  const dispatch = useDispatch()

  useEffect(() => {
    getQuotation()
      .then((data) => {
        if (data.data.data !== null) {
          const myData = data.data.data
          console.log('myData', myData)
          const newData = myData.map((data, index) => {
            return {
              ...data,
              id: index + 1,
              quotation_status: getStatus(data.quotation_status),
              quotation_issue_date: getDateByMoment(data.quotation_issue_date),
              quotation_valid_until_date: getDateByMoment(data.quotation_valid_until_date),
              quotation_over_due_date: checkOverDueDate(
                data.quotation_issue_date,
                data.quotation_valid_until_date,
                getStatus(data.quotation_status)
              ),
              contact_name: data.billing_info && data.billing_info.contact_name ? data.billing_info.contact_name : '-',
              project_name: data.billing_info && data.billing_info.project_name ? data.billing_info.project_name : '-',
              net_amount: toLocale(data.net_amount),
              ref_document_id: data.ref_document_id ? data.ref_document_id : '-',
              project_id: data.billing_info && data.billing_info.project_id ? data.billing_info.project_id : '-',
              quotation_document_id: data.quotation_document_id
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
          <BreadcrumbComponent name="รายงานใบเสนอราคา" key="3" to="#" />
        </Breadcrumbs>
      </Stack>
      <h1 style={{ margin: '15px 0 ' }}>รายงานใบเสนอราคา</h1>
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
