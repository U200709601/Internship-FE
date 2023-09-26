import SmartcpaasAppLayout from 'src/layouts/SmartcpaasAppLayout';

import { useTranslation } from 'react-i18next';
import RoutingTranslation from './RoutingTranslation';
// ----------------------------------------------------------------------


export default function RoutingTranslations() {
    const { t } = useTranslation();

    const TABS = [
        { id: 0, label: t('translation'), component: <RoutingTranslation /> },
        
    ];

    const TITLE = t('translation');

    return (
        <SmartcpaasAppLayout tabs={TABS} title={TITLE} />
    );
}
