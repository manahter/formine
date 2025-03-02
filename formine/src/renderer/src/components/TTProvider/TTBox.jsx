import { Box, Typography, Divider } from '@mui/material'
import { alpha } from '@mui/material/styles';
import React from 'react'

function TTBox({
    title,
    titleCenter = false,
    headerActionMode = false,
    headerActionText,
    headerActionTools,
    headerTools,
    footerTools,
    bgcolor,
    sx,
    sxContent,
    children,
    ...props
}) {
    return (
        <Box
            {...props}
            sx={{
                ...{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    borderRadius: 6,
                    transition: theme => theme.me.transition,
                    // background: theme => theme.me.background,
                    background: theme => bgcolor ? alpha(bgcolor, 0.1) : theme.me.background,
                    boxShadow: theme => theme.me.softShadow,
                    border: theme => theme.me.softBorder,
                    '&:hover': {
                        // boxShadow: theme => theme.me.softShadowHover,
                    }
                },
                ...sx,
            }
            } >
            {(title || headerTools) &&
                <Box sx={{
                    m: 1,
                    mb: 0,
                    px: 1,
                    pt: 0.5,
                    pb: 0.5,
                    borderRadius: 4.5,
                    display: 'flex',
                    maxHeight: 36, minHeight: 36,
                    alignItems: 'center',
                    boxShadow: headerActionMode && "inset 4px 4px 8px #0008",
                    justifyContent: ((titleCenter && !headerTools) ? 'center' : 'space-between'),
                    bgcolor: theme => headerActionMode && alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
                }}>
                    <Typography
                        variant="subtitle1"
                        color='textPrimary'
                        sx={{ fontWeight: headerActionMode ? '' : 'bold', ml: 1 }}>
                        {!headerActionMode ? title : headerActionText}
                    </Typography>
                    {headerActionMode ? headerActionTools : headerTools}
                </Box>}
            {(title || headerTools) && <Divider sx={{ mx: 3 }} />}

            {/* Content Area */}
            <Box sx={{ flexGrow: 1, ...sxContent }}>
                {children}
            </Box>

            {footerTools && <Divider sx={{ mx: 3 }} />}
            <Box sx={{ p: 1.5, textAlign: 'right' }}>
                {footerTools}
            </Box>
        </ Box>
    )
}

export default TTBox
