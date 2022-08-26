import React, { useState, useEffect } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, FormControl, IconButton, Input, InputLabel } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';


function SimpleDialog({ onClose, initialWord, open, item, handleChangeAssumption, onSave, clickedItemMainIndex, clickedItemIndex }) {

    const [wordsIndex, setWordsIndex] = useState([]);
    const [error, setError] = useState(true);
    /* eslint-disable */
    const regex = new RegExp('\[$].*[$]\$', 'g');

    useEffect(() => {
        handleFindWord();
    }, [item]);

    const [inputWords, setInputWords] = useState([]);

    const handleFindWord = () => {
        const inputs = item?.match(/\$(.*?)\$/g);
        setInputWords(inputs);
        setWordsIndex(inputs)
    }

    const handleClose = () => {
        onClose();
    };

    const handleReplaceWord = () => {
        const assumptionStringToArray = item?.split(' ');
        let counter = 0
        assumptionStringToArray?.forEach((element, index) => {
            if (element.match(/\$(.*?)\$/g)) {
                assumptionStringToArray[index] = "$" + wordsIndex[counter] + "$";
                counter += 1;
            }
        });
        handleChangeAssumption(assumptionStringToArray.join(' '));
        setWordsIndex([]);
        onSave()
        onClose();
    }
    const handleChangeInput = (value, index) => {
        const newReplacedWordsArray = [...wordsIndex];
        newReplacedWordsArray[index] = value;
        setWordsIndex(newReplacedWordsArray);
        setError(validateInputs(newReplacedWordsArray));
    }

    const validateInputs = (inputWordsArray) => {
        let isNotValid = false;
        inputWordsArray.forEach((item) => {
            if (item === '')
                isNotValid = true;
        })
        return isNotValid;
    }
    return (
        <Dialog onClose={handleClose} open={open}>
            <div className='dialog-header'>
                <DialogTitle sx={{
                    fontWeight: '500',
                    fontSize: '24px'
                }}>
                    <div>Change content</div>
                    {/* {onClose ? (
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                                marginTop: '5px',
                                marginRight: '5px'
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    ) : null} */}
                </DialogTitle>
            </div>
            <div className='dialog-content'>
                <div className='dialog-form'>
                    <span className='sentence'
                        style={{ cursor: 'pointer' }}
                        dangerouslySetInnerHTML={{
                            __html: item?.replaceAll(/\$(.*?)\$/g, (textInBetween) => {
                                return `<span style=color:red>${textInBetween.substring(1, textInBetween.length - 1)}</span>`
                            })
                        }}
                    />
                    {inputWords?.map((element, index) => {
                        return <div key={index} className='dialog-input'>
                            <FormControl variant="standard" sx={{ width: '30%' }}>
                                <InputLabel htmlFor="component-simple">CURRENT TEXT</InputLabel>
                                <Input
                                    value={initialWord[clickedItemMainIndex][clickedItemIndex][index]?.replaceAll('$', '')}
                                    sx={{ width: "100px" }}
                                    variant='outlined'
                                    disabled
                                />
                            </FormControl>

                            <FormControl variant="standard" sx={{ width: '30%' }}>
                                <InputLabel htmlFor="component-simple">REPLACEMENT TEXT</InputLabel>
                                <Input
                                    onChange={(e) => handleChangeInput(e.target.value, index)}
                                    value={wordsIndex?.[index]?.replaceAll('$', '') || ''}
                                    sx={{ width: "100px" }}
                                    variant='outlined'
                                />
                            </FormControl>
                            <br />
                        </div>
                    })}
                </div>
                <div className='save-button'>
                    <Button
                        onClick={handleReplaceWord}
                        disabled={error}
                        color="error"
                        variant='contained'>
                        Apply changes
                    </Button>
                </div>
            </div>
        </Dialog >
    );
}
export default SimpleDialog;