import { ImpactItem } from '@/types';

export function getCoreImpactWithoutVerification(items: ImpactItem[]): string[] {
    return items
        .filter((item) => item.isFocal || item.colSpan === 'md:col-span-2')
        .filter((item) => !item.verification || item.verification.level !== 'strict')
        .map((item) => item.id);
}

export function allCoreImpactHasStrictVerification(items: ImpactItem[]): boolean {
    return getCoreImpactWithoutVerification(items).length === 0;
}
