import React from 'react'
import { Dropdown, Menu, Icon } from 'semantic-ui-react'

class CategoriesDropDown extends React.Component
{
    componentDidMount() {
    } 

    render(){
        if (this.props.isMobile){
            return (
                <React.Fragment>
                    <Menu.Menu>
                        <a className="item">
                            <Icon name="folder outline"></Icon>
                            Categories
                        </a>
                        <Menu.Item>Comedy</Menu.Item>
                        <Menu.Item>History</Menu.Item>
                        <Menu.Item>Biography</Menu.Item>
                        <Menu.Item>Fiction</Menu.Item>
                    </Menu.Menu>
                </React.Fragment>
            );
        }
        else
        {

            return (
                <Dropdown item icon='folder outline' simple labeled text="Categories">
                    <Dropdown.Menu>
                        <Dropdown.Item>Comedy</Dropdown.Item>
                        <Dropdown.Item>History</Dropdown.Item>
                        <Dropdown.Item>Biography</Dropdown.Item>
                        <Dropdown.Item>Fiction</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            );
        }
    }
}

export default CategoriesDropDown
