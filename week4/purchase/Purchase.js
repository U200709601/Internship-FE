import SmartcpaasAppLayout from 'src/layouts/SmartcpaasAppLayout';
import { useTranslation } from 'react-i18next';
import { UcassManagement } from './ucServices';
import OrderHistory from './orderHistory/OrderHistory';
// ----------------------------------------------------------------------

export default function Purchase() {
    const { t } = useTranslation();

    const TABS = [
        { id: 0, label: t('Ucc-packages'), component: <UcassManagement /> },
        { id: 1, label: t('order-history'), component: <OrderHistory/> },
        
    ];

    const TITLE = t('purchase');

    return (
        <SmartcpaasAppLayout tabs={TABS} title={TITLE} />
    );
}
