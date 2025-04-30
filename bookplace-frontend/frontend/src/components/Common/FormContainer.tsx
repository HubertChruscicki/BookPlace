    import Container from "@mui/material/Container";
    import Paper from "@mui/material/Paper";
    import {Box, Typography} from "@mui/material";
    import {colors} from "../../theme/colors.ts"
    import React from "react";

    interface FormContainerProps {
        title?: string;
        children?: React.ReactNode;
        onSubmit?: React.FormEventHandler<HTMLFormElement>;
        modal?: boolean;
        onClose?: () => void;
    }

    const FormContainer: React.FC<FormContainerProps> = ({title, onSubmit, modal, children}) => {

        return (
            <Container maxWidth="md" sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                ...(modal ?  {textAlign: "center"} : {}),
                flexDirection: "column",
                height: "100vh",
            }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        ...(modal ? {} : { minWidth: "35vw" }),
                        ...(modal ? { maxWidth: "600px" } : {}),
                        ...(modal ? { width: "100%" } : {}),

                        position: 'relative',
                        borderRadius: 5
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: colors.black[900],
                            letterSpacing: '-0.5px',
                            fontSize: '2.5rem',
                            lineHeight: 1.2,
                            padding: "50px 0",
                            whiteSpace: "pre-line"
                        }}
                    >
                        {title}
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={onSubmit}
                        sx={{
                            width: "100%",
                            '& .MuiFormControl-root': {
                                mb: 4,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    width: "100%",
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: colors.blue[300],
                                    }
                                }
                            }
                        }}
                    >
                        {children}
                    </Box>

                </Paper>
            </Container>
        )

    }

    export default FormContainer;
