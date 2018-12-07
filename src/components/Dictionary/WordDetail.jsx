import React from 'react';
import { Icon, Collapse, Tabs } from 'antd';
import './style.scss';
import WordMeaning from './WordMeaning.jsx';
import WordTranslations from './WordTranslations.jsx';
import WordRelationships from './WordRelationships.jsx';

const TabPane = Tabs.TabPane;

class WordDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  toggle() {
    this.setState(prevState => ({
      open: !prevState.open
    }));
  }


  render() {
    const { word } = this.props;
    return (
      <div>
        <span style={{ float: 'left' }} onClick={this.toggle.bind(this)}>
          <Icon type={this.state.open ? "up" : "down"} />
        </span>
        <div className={"collapse" + (this.state.open ? ' in' : '')}>
          <Tabs defaultActiveKey="1" tabPosition="right">
            <TabPane tab="معانی" key="meanings">
              <WordMeaning word={word} isShown={this.state.open} />
            </TabPane>
            <TabPane tab="تراجم" key="translations">
              <WordTranslations word={word} isShown={this.state.open} />
            </TabPane>
            <TabPane tab="روابط" key="relationship">
              <WordRelationships word={word} isShown={this.state.open} />
            </TabPane>
          </Tabs>
        </div>
      </div>);
  }
}

export default WordDetail;
