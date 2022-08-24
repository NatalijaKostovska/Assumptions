import React from 'react'
import { Checkbox, FormGroup } from '@mui/material';

function CheckboxList({ itemFound, checkbox, mainIndex, handleClickOpen, toggleCheckBox }) {
    return (
        <>
            {itemFound.map((topic, index) =>
                <div className="assumption" key={index}>
                    <div className='topic'>{topic.item.title}</div>
                    <br />
                    <FormGroup>
                        {topic.item.assumption.map((item, idx) =>
                            <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                                <Checkbox
                                    onClick={!checkbox?.[mainIndex]?.includes(index) && item.includes('$') ? () => handleClickOpen(item, index, idx) : () => toggleCheckBox(index, idx)}
                                    checked={checkbox?.[topic.index].includes(idx)}
                                />
                                <div
                                    key={idx}
                                    style={{ cursor: 'pointer' }}
                                    dangerouslySetInnerHTML={{
                                        __html: item.replaceAll(/\$(.*?)\$/g, (textInBetween) => {
                                            return `<span style=color:red>${textInBetween.substring(1, textInBetween.length - 1)}</span>`
                                        })
                                    }}
                                />
                            </div>
                        )}
                    </FormGroup>
                </div>
            )}
        </>
    )
}

export default CheckboxList;