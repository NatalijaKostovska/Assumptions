import { Button, Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SimpleDialog from './SimpleDialog';

function FileUploadPage() {

    const [selectedFile, setSelectedFile] = useState([]);
    const [errorMessage, setErrorMessage] = useState();
    const reader = new FileReader();
    const [open, setOpen] = React.useState(false);
    const [clickedItem, setClickedItem] = React.useState();
    const [clickedItemIndex, setClickedItemIndex] = React.useState();
    const [clickedItemMainIndex, setClickedItemMainIndex] = React.useState();
    const [itemFound, setItemFound] = useState([]);
    const [checkbox, setCheckBox] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const toggleCheckBox = (objectIndex, arrayIndex) => {

        let tmp = [...checkbox];
        if (tmp[objectIndex]?.includes(arrayIndex)) {
            tmp[objectIndex] = tmp[objectIndex].filter(index => index !== arrayIndex)
        }
        else {
            tmp[objectIndex].push(arrayIndex);
        }
        setCheckBox(tmp)
    }

    const handleClickOpen = (item, mainItemIndex, itemIndex) => {
        setOpen(true);
        setClickedItem(item)
        setClickedItemIndex(itemIndex)
        setClickedItemMainIndex(mainItemIndex);
    }

    const handleClickCheckbox = (e, mainItemIndex, itemIndex) => {
        toggleCheckBox(mainItemIndex, itemIndex);
    }

    // read JSON file
    const changeHandler = (e) => {
        reader.onload = (e) => {
            const text = e.target.result;
            setSelectedFile(JSON.parse(text));
            const checkboxArray = [];
            Object.keys(JSON.parse(text)).map((item) => {
                return checkboxArray.push([]);
            })
            setCheckBox(checkboxArray)
        }
        if (e.target.files.length === 0) {
            setErrorMessage('No file selected');
            return;
        }
        reader?.readAsText(e.target.files[0]);
    };

    // function for modal to close
    const handleClose = () => {
        setOpen(false);
    };

    //  change the sentence in file
    const handleChangeAssumption = (sentence) => {
        let fileChanges = [...selectedFile];
        fileChanges[clickedItemMainIndex].assumption[clickedItemIndex] = sentence;

        setSelectedFile(fileChanges);
    }

    // search bar function
    const findWord = (e) => {
        // if the input is empty reset the state (search list)
        setSearchValue(e.target.value);
        if (e.target.value.length === 0) {
            setItemFound([]);
        } else {
            // if word is found in TITLE put the object in array and the array in state
            let foundAssumtions = [];
            selectedFile.forEach((item, index) => {
                // search in title
                if (item.title?.toLowerCase().includes(e.target.value.toLowerCase())) {
                    foundAssumtions.push({ item: item, index: index })
                }
                else {
                    // search in assumtions array
                    if (item?.assumption?.filter(assumption => assumption?.includes(e.target.value.toLowerCase())).length > 0) {
                        if (!foundAssumtions.includes(item)) {
                            foundAssumtions.push({ item: item, index: index })
                        }
                    }
                }
            })
            setItemFound(foundAssumtions);
        }
    }


    const handleCopyToClipboard = () => {
        const clipboardContent = selectedFile.reduce(function (previousValue, currentValue, currentIndex) {

            if (checkbox[currentIndex].length > 0) {
                let newCurrentValue = currentValue?.title + '2\n';
                currentValue?.assumption?.forEach((assumption, index) =>
                    // if checkbox is selected and we have index for that item in the array
                    checkbox[currentIndex].length !== 0 && checkbox[currentIndex]?.includes(index) && (
                        newCurrentValue = newCurrentValue + '\n' + assumption.replace(/[$]/gi, "")))
                return previousValue + '\n' + newCurrentValue + '\n';
            } else {
                return previousValue;
            }
        }, '')
        navigator.clipboard.writeText((clipboardContent));
    }

    return (
        <div className='content'>
            <div className='bar'>
                <div className='upload-button'>
                    <Button variant="contained" component="label">
                        Upload JSON file
                        <input hidden type="file" name="file" onChange={(e) => changeHandler(e)} />
                    </Button>
                </div>
                <TextField variant='outlined' type="text" onChange={findWord} sx={{ width: '170px', marginBottom: '15px', borderRadius: '50px' }} label="Search" />
            </div>
            <div className='error-message'>{errorMessage}</div>
            <div className='list'>
                {itemFound.length === 0 && searchValue === '' ?
                    selectedFile?.map((topic, mainIndex) =>
                        <div key={mainIndex} className="assumption">
                            <div className='topic'>{topic.title}</div>
                            <FormGroup>
                                {topic.assumption.map((item, index) =>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox onClick={(e) => handleClickCheckbox(e, mainIndex, index)}
                                            checked={checkbox?.[mainIndex].includes(index)}
                                        />
                                        <div
                                            key={index}
                                            onClick={(e) => handleClickOpen(item, mainIndex, index)}
                                            style={{ cursor: 'pointer' }}
                                        >

                                            {item.replace(/[$]/gi, "")}
                                        </div>
                                    </div>
                                )}
                            </FormGroup>
                        </div>
                    )
                    :
                    <>
                        <div className='search-result'>Search result:</div>
                        {itemFound.map((topic, index) =>
                            <div className="assumption" key={index}>
                                <div className='topic'>{topic.item.title}</div>
                                <br />
                                <FormGroup>
                                    {topic.item.assumption.map((item, idx) =>
                                        // <li>{item.replace(/[$]/gi, "")}</li>)}
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Checkbox onClick={(e) => handleClickCheckbox(e, topic.index, idx)}
                                                checked={checkbox?.[topic.index].includes(idx)}
                                            />
                                            <div
                                                key={idx}
                                                onClick={(e) => handleClickOpen(item, topic.index, idx)}
                                            >

                                                {item.replace(/[$]/gi, "")}
                                            </div>
                                        </div>
                                    )}
                                </FormGroup>
                            </div>
                        )
                        }
                    </>
                }
            </div>
            <div className='clipboard-button'>
                <Button onClick={handleCopyToClipboard}> Copy to Clipboard</Button>
            </div>
            <SimpleDialog
                open={open}
                onClose={handleClose}
                item={clickedItem}
                handleChangeAssumption={handleChangeAssumption}
            />
        </div >
    )
}
export default FileUploadPage;
