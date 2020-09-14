<template>
  <div class="d-flex flex-column fill-height flex overflow-hidden" ref="girdWrapper">
    <ag-grid-vue
      class="info-grid grid-card"
      style="width: 100%; height: 100%;"
      :columnDefs="columnDefs"
      :rowData="searchedList"
      animateRows
      :grid-options="gridOptions"
      @first-data-rendered="onFirstDataRendered"
      @grid-ready="onGridReady"
      @resize="onResize"
      @grid-size-changed="onGridSizeChanged"
    >
    </ag-grid-vue>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AgGridVue } from 'ag-grid-vue';
import { ColDef, ColumnApi, GridApi, GridOptions } from 'ag-grid-community';
import Controller from './Controller.vue';
import { Action, Getter, State } from 'vuex-class';
import { Track } from '@/types/Track';
import { TracksActionTypes, TracksGettersTypes, TracksStateTypes } from '@/store/tracks';

@Component({
  components: {
    AgGridVue,
  },
})
export default class MusicTrackList extends Vue {
  /******************************************************************
   * Store
   * ****************************************************************/
  @State(TracksStateTypes.TRACK_LIST, { namespace: 'tracks' }) private data!: Track[];
  @Getter(TracksGettersTypes.GET_FILTERED_TRACKS, { namespace: 'tracks' }) private searchedList!: Track[];
  @Action(TracksActionTypes.GET_ALL_TRACKS, { namespace: 'tracks' }) private getAllTracks!: () => [];

  /******************************************************************
   * Variable
   * ****************************************************************/
  private columnDefs: ColDef[] = [
    {
      headerName: 'play',
      field: 'id',
      cellRendererFramework: Controller,
      editable: false,
      minWidth: 100,
      width: 100,
      maxWidth: 100,
    },
    {
      headerName: 'title',
      field: 'title',
      filter: false,
    },
    {
      headerName: 'artist',
      field: 'artist',
      filter: false,
      maxWidth: 130,
    },
    {
      headerName: 'album',
      field: 'album',
      filter: false,
    },
  ];

  private gridOptions: GridOptions = {
    rowHeight: 100,
    headerHeight: 30,
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true,
      editable: true,
      flex: 1,
    },
  };
  private gridApi: GridApi | null = null;
  private columnApi: ColumnApi | null = null;
  private girdWrapper: HTMLElement | null = null;

  /*********************************************************************************
   * Life Cycles
   * ********************************************************************************/
  mounted() {
    this.gridApi = this.gridOptions.api as GridApi;
    this.columnApi = this.gridOptions.columnApi as ColumnApi;
    this.girdWrapper = this.$refs.girdWrapper as HTMLElement;
  }
  /**************************************************************************
   * Methods
   * ***********************************************************************/
  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  onResize() {
    this.gridApi!.sizeColumnsToFit();
  }

  onGridSizeChanged(params: any) {
    const gridWidth = this.girdWrapper!.offsetWidth;
    const columnsToShow = [];
    const columnsToHide = [];
    let totalColsWidth = 0;
    const allColumns = params.columnApi.getAllColumns();
    for (let i = 0; i < allColumns.length; i++) {
      const column = allColumns[i];
      totalColsWidth += column.getMinWidth();
      if (totalColsWidth > gridWidth) {
        columnsToHide.push(column.colId);
      } else {
        columnsToShow.push(column.colId);
      }
    }
    params.columnApi.setColumnsVisible(columnsToShow, true);
    params.columnApi.setColumnsVisible(columnsToHide, false);
    params.api.sizeColumnsToFit();
  }
  onGridReady() {
    const gridApi = this.gridApi;
    gridApi!.sizeColumnsToFit();
    window.addEventListener('resize', function() {
      setTimeout(function() {
        gridApi!.sizeColumnsToFit();
      });
    });

    gridApi!.sizeColumnsToFit();
  }
}
</script>
<style lang="scss">
@import '~ag-grid-community/src/styles/ag-grid.scss';
@import '~ag-grid-community/src/styles/ag-theme-balham/sass/ag-theme-balham-mixin.scss';

.info-grid {
  width: 100%;
  height: calc(100% - 40px);
  @include ag-theme-balham(
    (
      font-family: (
        inherit,
        sans-serif,
      ),
      font-size: 14px,
      balham-active-color: #5d95f4,
      header-background-color: #d4d8e9,
      foreground-color: #222,
      selected-row-background-color: #5d95f4,
    )
  );
  .ag-root-wrapper {
    border: 1px solid #ccc;
    /*border-radius: 5px;*/
    color: #555;
  }
  .ag-cell-wrapper > *:not(.ag-cell-value):not(.ag-group-value)ag-root-wrapper {
    margin: auto;
  }
  .ag-header-cell-text {
    font-size: 1em;
    font-weight: 800;
    color: #222;
  }
  .ag-row .ag-cell {
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ag-row .ag-cell-value {
    letter-spacing: -1px;
    color: #555;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ag-checkbox-input-wrapper {
    font-size: 25px;
    line-height: 25px;
    width: 25px;
    height: 25px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .ag-row-selected {
    background: #5d95f4;
    .ag-cell,
    .ag-icon {
      color: #fff;
    }
    .ag-checkbox-input-wrapper::after {
      color: #5d95f4;
    }
  }
  .ag-checkbox-input-wrapper:hover {
    background: #f5f5f5;
  }
  .ag-checkbox-input-wrapper::after {
    content: '';
    border-radius: 5px;
  }
  .ag-checkbox-input-wrapper.ag-checked::after {
    top: -1px;
    left: -1px;
  }
  .ag-icon {
    // required because Font Awesome uses bold glyphs for its icons
    justify-content: center;
    display: flex;
    font-size: 21px;
  }
  .ag-icon-grip:before {
    content: 'menu';
  }
}
</style>
