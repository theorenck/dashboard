var RTable = React.createClass({

  render: function render() {
    var _self = this;

    var thead = React.DOM.thead({},
      React.DOM.tr({},
        this.props.columns.map(function (col) {
          return React.DOM.th({}, col.name);
      })));

    var tbody = React.DOM.tbody({},
      this.props.rows.map(function (row) {
        return React.DOM.tr({},
        _self.props.columns.map(function (col, i) {
          return React.DOM.td({}, row[i] || "");
        }));
      })
    );

    return React.DOM.table({className : "table table-bordered table-striped table-float-thead"}, [thead, tbody]);
  }

});