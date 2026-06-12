import { addVolunteer, removeVolunteer } from '../models/volunteers.js';

export const processVolunteer = async (req, res) => {
    try {
        await addVolunteer(req.session.user.user_id, req.params.id);
        req.flash('success', 'You have volunteered for this project!');
    } catch (err) {
        req.flash('error', 'Unable to join project.');
    }
    res.redirect(`/project/${req.params.id}`);
};

export const processRemoveVolunteer = async (req, res) => {
    try {
        await removeVolunteer(req.session.user.user_id, req.params.id);
        req.flash('success', 'You have removed your volunteer status.');
    } catch (err) {
        req.flash('error', 'Unable to remove volunteer status.');
    }
    res.redirect(req.headers.referer || `/project/${req.params.id}`);
};