import { ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { Text, View } from 'tamagui'
import Notification from '@/components/Notification'

const notification = () => {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Notification
                sender="John Doe"
                date="2023-10-01"
                title="Welcome to ServiPal"
                content="Your one-stop app for item delivery, food ordering, laundry services, and secure online peer-to-peer shopping."
            />
            <Notification
                sender="Jane Smith"
                date="2023-10-02"
                title="Quick & Reliable Delivery"
                content="Send and receive packages with ease, anywhere, anytime."
            />
            <Notification
                sender="Jane Smith"
                date="2023-10-02"
                title="Quick & Reliable Delivery"
                content="Send and receive packages with ease, anywhere, anytime."
            />
            <Notification
                sender="Jane Smith"
                date="2023-10-02"
                title="Quick & Reliable Delivery"
                content="Send and receive packages with ease, anywhere, anytime."
            />
            <Notification
                sender="Jane Smith"
                date="2023-10-02"
                title="Quick & Reliable Delivery"
                content="Send and receive packages with ease, anywhere, anytime."
            />
            <Notification
                sender="Jane Smith"
                date="2023-10-02"
                title="Quick & Reliable Delivery"
                content="Send and receive packages with ease, anywhere, anytime."
            />
            <Notification
                sender="Jane Smith"
                date="2023-10-02"
                title="Quick & Reliable Delivery"
                content="Send and receive packages with ease, anywhere, anytime."
            />
            <Notification
                sender="Jane Smith"
                date="2023-10-02"
                title="Quick & Reliable Delivery"
                content="Send and receive packages with ease, anywhere, anytime."
            />
            <Notification
                sender="Jane Smith"
                date="2023-10-02"
                title="Quick & Reliable Delivery"
                content="Send and receive packages with ease, anywhere, anytime."
            />
            <Notification
                sender="Jane Smith"
                date="2023-10-02"
                title="Quick & Reliable Delivery"
                content="Send and receive packages with ease, anywhere, anytime."
            />
            <Notification
                sender="Jane Smith"
                date="2023-10-02"
                title="Quick & Reliable Delivery"
                content="Send and receive packages with ease, anywhere, anytime."
            />
            <Notification
                sender="Jane Smith"
                date="2023-10-02"
                title="Quick & Reliable Delivery"
                content="Send and receive packages with ease, anywhere, anytime."
            />
        </ScrollView>
    )
}

export default notification

const styles = StyleSheet.create({})