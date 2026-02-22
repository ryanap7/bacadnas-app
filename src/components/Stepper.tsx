import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '~/constants';
import { Text } from './Text';

// ─── Types ──────────────────────────────────────────────────
export interface StepItem {
    label: string;
    key: string;
}

interface StepperProps {
    steps: StepItem[];
    currentStep: number; // 0-based index
}

// ─── Component ──────────────────────────────────────────────
export function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <View style={styles.container}>
            {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const isLast = index === steps.length - 1;

                return (
                    <React.Fragment key={step.key}>
                        {/* Step Circle & Label */}
                        <View style={styles.stepWrapper}>
                            {/* Circle */}
                            <View
                                style={[
                                    styles.circle,
                                    isCompleted && styles.circleCompleted,
                                    isActive && styles.circleActive,
                                ]}
                            >
                                {isCompleted ? (
                                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                                ) : (
                                    <View
                                        style={[
                                            styles.circleDot,
                                            isActive && styles.circleDotActive,
                                        ]}
                                    />
                                )}
                            </View>

                            {/* Label */}
                            <Text
                                weight={isActive || isCompleted ? 'semibold' : 'regular'}
                                size="xs"
                                color={
                                    isCompleted
                                        ? colors.success.dark
                                        : isActive
                                            ? colors.primary.main
                                            : colors.text.secondary
                                }
                                style={styles.label}
                            >
                                {step.label}
                            </Text>
                        </View>

                        {/* Connector Line */}
                        {!isLast && (
                            <View
                                style={[
                                    styles.connector,
                                    isCompleted && styles.connectorCompleted,
                                ]}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.background.light,
    },
    stepWrapper: {
        alignItems: 'center',
        flex: 1,
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.border.light,
        backgroundColor: colors.background.light,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xs,
    },
    circleCompleted: {
        borderColor: colors.success.dark,
        backgroundColor: colors.success.dark,
    },
    circleActive: {
        borderColor: colors.primary.main,
        backgroundColor: colors.background.light,
    },
    circleDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.border.light,
    },
    circleDotActive: {
        backgroundColor: colors.primary.main,
    },
    label: {
        textAlign: 'center',
        marginTop: 4,
    },
    connector: {
        height: 2,
        backgroundColor: colors.border.light,
        marginTop: 12,
        flex: 0.5,
    },
    connectorCompleted: {
        backgroundColor: colors.success.dark,
    },
});