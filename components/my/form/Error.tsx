import { useMemo } from "react"
import { StyleSheet, Text } from "react-native"

function Error({
    errors,
    ...props
}: {
    errors?: Array<{ message?: string } | undefined>
}) {
    const content = useMemo(() => {

    if (!errors?.length) {
        return null
    }

    return (
        errors.map(
          (error, index) =>
            error?.message && <Text key={index} style={styles.error}>{error?.message}</Text>
        )
    )
    }, [errors])

    if (!content) {
        return null
    }

    return (<>{content}</>)
}

const styles = StyleSheet.create({
    error: {
        color: '#d9534f',
        marginTop: 6,
        fontSize: 13,
    },
})


export { Error }

