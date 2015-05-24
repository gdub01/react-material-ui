DatePickerDialog = React.createClass({

  mixins: [StylePropable, WindowListenable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    initialDate: React.PropTypes.object,
    onAccept: React.PropTypes.func,
    onShow: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
    minDate: React.PropTypes.object,
    maxDate: React.PropTypes.object,
  },

  windowListeners: {
    'keyup': '_handleWindowKeyUp'
  },

  getInitialState: function() {
    return {
      isCalendarActive: false
    };
  },

  render: function() {
    var {
      initialDate,
      onAccept,
      style,
      ...other
    } = this.props;

    var styles = {
      root: {
        fontSize: '14px',
        color: this.context.muiTheme.component.datePicker.calendarTextColor
      },
      
      dialogContents: {
        width: this.props.mode === 'landscape' ? '560px' : '280px'
      },

      actions: {
        marginRight: 8,
      }
    };

    var actions = [
      <FlatButton
        key={0}
        label="Cancel"
        secondary={true}
        style={styles.actions}
        onClick={this._handleCancelClick} />,
      <FlatButton
        key={1}
        label="OK"
        secondary={true}
        style={styles.actions}
        onClick={this._handleOKClick} />
    ];

    if(this.props.autoOk){
      actions = actions.slice(0, 1);
    }

    return (
      <DialogWindow {...other}
        ref="dialogWindow"
        style={styles.root}
        contentStyle={styles.dialogContents}
        actions={actions}
        onDismiss={this._handleDialogDismiss}
        onShow={this._handleDialogShow}
        repositionOnUpdate={false}>
        <Calendar
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          ref="calendar"
          onSelectedDate={this._onSelectedDate}
          initialDate={this.props.initialDate}
          isActive={this.state.isCalendarActive}
          mode={this.props.mode} />
      </DialogWindow>
    );
  },

  show: function() {
    this.refs.dialogWindow.show();
  },

  dismiss: function() {
    this.refs.dialogWindow.dismiss();
  },

  _onSelectedDate: function(){
    if(this.props.autoOk){
      setTimeout(this._handleOKClick.bind(this), 300);
    }
  },

  _handleCancelClick: function() {
    this.dismiss();
  },

  _handleOKClick: function() {
    this.dismiss();
    if (this.props.onAccept) {
      this.props.onAccept(this.refs.calendar.getSelectedDate());
    }
  },

  _handleDialogShow: function() {
    this.setState({
      isCalendarActive: true
    });

    if(this.props.onShow) {
      this.props.onShow();
    }
  },

  _handleDialogDismiss: function() {
    this.setState({
      isCalendarActive: false
    });

    if(this.props.onDismiss) {
      this.props.onDismiss();
    }
  },

  _handleWindowKeyUp: function(e) {
    if (this.refs.dialogWindow.isOpen()) {
      switch (e.keyCode) {
        case KeyCode.ENTER:
          this._handleOKClick();
          break;
      }
    }
  }

});