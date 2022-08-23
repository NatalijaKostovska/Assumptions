import { Button, Checkbox, FormGroup, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { exampleJson } from '..';
import DialogContent from './DialogContent';
import SimpleDialog from './SimpleDialog';
import jsonFile from './../testfile.json';

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
    const [openDialog, setOpenDialog] = React.useState(false);

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

    const handleClickCheckbox = () => {
        toggleCheckBox(clickedItemMainIndex, clickedItemIndex);
    }

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleClickOpen = (item, mainItemIndex, itemIndex) => {
        setOpen(true);
        setClickedItem(item)
        setClickedItemIndex(itemIndex)
        setClickedItemMainIndex(mainItemIndex);
    }


    // read JSON file
    useEffect(() => {
        setSelectedFile(jsonFile);
        const checkboxArray = [];
        Object.keys(jsonFile).map((item) => {
            return checkboxArray.push([]);
        })
        setCheckBox(checkboxArray);
    }, [])

    const changeHandler = () => {

    };

    // function for modal to close
    const handleClose = () => {
        setOpen(false);
    };


    const handleCloseDialog = () => {
        setOpenDialog(false);
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
        const type = "text/html";
        const clipboardContent = selectedFile.reduce(function (previousValue, currentValue, currentIndex) {
            const type = "text/json";
            if (checkbox[currentIndex].length > 0) {
                let newCurrentValue = '<li><span style="font-family:Calibri, sans-serif">' + currentValue?.title + '</span></li>' + '\n';
                currentValue?.assumption?.forEach((assumption, index) => {
                    // if checkbox is selected and we have index for that item in the array
                    checkbox[currentIndex].length !== 0 && checkbox[currentIndex]?.includes(index) && (
                        newCurrentValue = newCurrentValue + '\n' + '<li><ul><span style="font-family:Calibri, sans-serif">' + assumption.replace(/[$]/gi, "") + '</span></ul></li>' + '\n')
                }
                )
                return '\n' + previousValue + '\n' + newCurrentValue + '\n';
            } else {
                return previousValue;
            }
        }, '')
        const blob = new Blob([clipboardContent], { type });
        const data = [new window.ClipboardItem({ [type]: blob })];

        navigator.clipboard.write(data).then(
            navigator.clipboard.writeText((clipboardContent)))
    }

    return (
        <div className='content'>
            <div className='bar'>
                <div className='buttons-group'>
                    <DialogContent
                        open={openDialog}
                        onClose={handleCloseDialog}
                    >
                        <pre>
                            <code>
                                {JSON.stringify(exampleJson, null, 4)}
                            </code>
                        </pre>
                    </DialogContent>
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
                                        <Checkbox onClick={item.includes('$') ? () => handleClickOpen(item, mainIndex, index) : () => toggleCheckBox(mainIndex, index)}
                                            checked={checkbox?.[mainIndex].includes(index)}
                                        />
                                        <div
                                            key={index}
                                            // onClick={(e) => handleClickOpen(item, mainIndex, index)}
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
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Checkbox
                                                onClick={() => handleClickOpen(item, index, idx)}
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
                }
            </div>
            <div className='clipboard-button'>
                <Button onClick={handleCopyToClipboard}>Copy to Clipboard</Button>
            </div>
            <SimpleDialog
                open={open}
                onClose={handleClose}
                item={clickedItem}
                handleChangeAssumption={handleChangeAssumption}
                onSave={handleClickCheckbox}
            />
        </div >
    )
}
export default FileUploadPage;
