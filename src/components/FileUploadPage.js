import { Button, Checkbox, FormGroup, TextField } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import SimpleDialog from './SimpleDialog';
import jsonFile from './../testfile.json';
import SearchRounded from '@mui/icons-material/Search';

function FileUploadPage() {

    const [selectedFile, setSelectedFile] = useState(jsonFile || []);
    const [open, setOpen] = React.useState(false);
    const [clickedItem, setClickedItem] = React.useState();
    const [clickedItemIndex, setClickedItemIndex] = React.useState();
    const [clickedItemMainIndex, setClickedItemMainIndex] = React.useState();
    const [itemFound, setItemFound] = useState([]);
    const [checkbox, setCheckBox] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [initialWord, setInitialWord] = useState([]);

    const toggleCheckBox = (objectIndex, arrayIndex) => {
        let tmp = [...checkbox];
        if (tmp[objectIndex]?.includes(arrayIndex)) {
            tmp[objectIndex] = tmp[objectIndex].filter(index => index !== arrayIndex)
        }
        else {
            tmp[objectIndex].push(arrayIndex);
        }
        setCheckBox(tmp);
    }

    const handleClickCheckbox = () => {
        toggleCheckBox(clickedItemMainIndex, clickedItemIndex);
    }

    const handleClickOpen = (item, mainItemIndex, itemIndex) => {
        setOpen(true);
        setClickedItem(item)
        setClickedItemIndex(itemIndex)
        setClickedItemMainIndex(mainItemIndex);
    }

    const handleSaveInitialValues = () => {
        let initialWordArray = [];
        Object.keys(jsonFile).map((item) => {
            return initialWordArray.push([]);
        });

        selectedFile?.map((topic, mainIndex) =>
            topic?.assumption?.map((item, index) =>
                item?.match(/\$(.*?)\$/g) &&
                (initialWordArray[mainIndex][index] = item.match(/\$(.*?)\$/g))
            )
        )
        setInitialWord(initialWordArray);
    }

    // read JSON file
    useEffect(() => {
        const checkboxArray = [];
        Object.keys(jsonFile).map((item) => {
            return checkboxArray.push([]);
        })
        setCheckBox(checkboxArray);
        /* eslint-disable */
        handleSaveInitialValues();
    }, [])

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
        const type = "text/html";
        const clipboardContent = selectedFile.reduce(function (previousValue, currentValue, currentIndex) {
            if (checkbox[currentIndex].length > 0) {
                let newCurrentValue = `<li><span style="font-family:Calibri, sans-serif"> ${currentValue?.title} </span></li>
                `
                currentValue?.assumption?.forEach((assumption, index) => {
                    // if checkbox is selected and we have index for that item in the array
                    checkbox[currentIndex].length !== 0 && checkbox[currentIndex]?.includes(index) && (
                        newCurrentValue =
                        `${newCurrentValue}
                        <li><ul><span style="font-family:Calibri, sans-serif">
                        ${assumption.replace(/[$]/gi, "")}
                        </span></ul></li>`
                    )
                })
                return `
                ${previousValue}
                ${newCurrentValue}
                `;
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
                <TextField
                    variant='outlined'
                    type="text"
                    onChange={findWord}
                    label={
                        <div style={{ display: 'flex' }}>
                            <SearchRounded />
                            Search...
                        </div>
                    }
                    sx={{ background: 'white', borderRadius: '50px' }}
                />
            </div>
            <div className='list'>
                {itemFound.length === 0 && searchValue === '' ?
                    selectedFile?.map((topic, mainIndex) =>
                        <div key={mainIndex} className="assumption">
                            <div className='topic'>
                                {topic.title}
                            </div>
                            <FormGroup>
                                {topic.assumption.map((item, index) =>
                                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox
                                            onClick={!checkbox?.[mainIndex]?.includes(index) && item.includes('$') ? () => handleClickOpen(item, mainIndex, index) : () => toggleCheckBox(mainIndex, index)}
                                            checked={checkbox?.[mainIndex]?.includes(index) || false}
                                            color='error'
                                        />
                                        <div
                                            key={index}
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
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Checkbox
                                                onClick={!checkbox?.[index]?.includes(index)
                                                    && item.includes('$') ?
                                                    () => handleClickOpen(item, index, idx) :
                                                    () => toggleCheckBox(index, idx)}
                                                checked={checkbox?.[topic.index].includes(idx) || false}
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
                <Button
                    onClick={handleCopyToClipboard}
                    color="error"
                    variant='contained'
                >Copy to Clipboard</Button>
            </div>
            <SimpleDialog
                open={open}
                onClose={handleClose}
                item={clickedItem}
                handleChangeAssumption={handleChangeAssumption}
                onSave={handleClickCheckbox}
                initialWord={initialWord}
                clickedItemIndex={clickedItemIndex}
                clickedItemMainIndex={clickedItemMainIndex}

            />
        </div>
    )
}
export default FileUploadPage;
