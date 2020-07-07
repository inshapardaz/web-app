import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom'
import queryString from 'query-string';

import { Input  } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;

class SearchBox extends Component {
  
    onSubmit = (value) => {
      console.log('submit');
      let values = queryString.parse(this.props.location.search)
      values.q = value;
      this.props.history.push(`/search?${queryString.stringify(values)}`)
    }

    render() {
        return (
            <>
                <Search placeholder={this.props.intl.formatMessage({ id : "header.search.placeholder" })}
                    style={{ width: 200 }}
                    onSearch={this.onSubmit}
                />
            </>
        )
    }
}

export default withRouter(injectIntl(SearchBox));
